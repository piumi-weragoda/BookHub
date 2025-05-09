import mongo from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongo.connect(process.env.MONGO_URI); 
        console.log('Database connected ${conn.connection.host}`);');
    } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
        //NOTE - 1 exit with failure
        //NOTE - 0 exit with success
    }
}