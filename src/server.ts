import dotenv from 'dotenv';
import app from './app';
import prisma from './config/db';

dotenv.config();

const port: number = parseInt(process.env.PORT || '3000', 10); // 10 bedeutet: Lies die Zahl als normale Dezimalzahl.


async function startServer () {
    try { await prisma.$connect();

console.log("connected to DB")
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
});

    }catch(error) {
console.error("Failed to connect to DB")
    process.exit(1);

    }
}


// disconnect prisma when server stops
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log("DB disconnected")
    process.exit(0);
});
startServer()