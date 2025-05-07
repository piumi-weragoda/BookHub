import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";





const router = express.Router();

//------------------------------------------------------------
//create
//delete
//update
//------------------------------------------------------------

router.post("/",protectRoute, async(req, res) => {
    //NOTE - protectRoute is a middleware function that checks if the user is authenticated
    try {
       const { title, caption, rating, image } = req.body;
       
       if(!image || !title || !caption || !rating){ {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        //upload image to cloudinary and save that in to the MongoDB
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        //NOTE - once the image has been uploaded to cloudinary, we can save the imageUrl to the MongoDB
        //new book object
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id,
        })

        //save it to database
        await newBook.save();

        res.status(201).json(newBook);

    }} catch (error) {
        console.log("Error in creating book", error);
        res.status(500).json({ message: error.message });
    }});

//pagination => infinite loading - (if we scroll down the page, more books will be loaded)
router.get("/",protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1; // get the page number from the query string
        const limit = req.query.limit || 10; // number of books to return per page
        const skip = (page - 1) * limit; // number of books to skip
        
        const books = await Book.find()
        .sort({createdAt: -1})
        .skip(skip) // skip the first (page - 1) * limit books
        .limit(limit) // limit the number of books returned to limit
        .populate("user", "username profileImage"); // populate the user field with the user data, excluding the password field
   
        const totalBooks = await Book.countDocuments(); // get the total number of books in the database
        
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit), // calculate the total number of pages
        });
        
    } catch (error) {
        console.log("Error in get all books route", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/:user",protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({createdAt: -1});
        res.json(books);
    } catch (error) {
       console.error("Get user books error:", error.message);
       res.status(500).json({ message: "Internal server error" }); 
    }
})


router.delete("/:id",protectRoute, async (req, res) => {

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        //check if the user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        //delete the image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0]; // get the public id of the image
                await cloudinary.uploader.destroy(publicId); // delete the image from cloudinary
                
            } catch (deleteError) {
                console.log("Error deleting image from cloudinary", deleteError);
            }
        }


        await book.deleteOne();

        res.json({message: "Book deleted successfully"});


    } catch (error) {
        
    }
});

export default router;

