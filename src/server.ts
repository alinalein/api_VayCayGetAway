import dotenv from 'dotenv';
import app from './app';
import prisma from './config/db';

dotenv.config();

const port: number = parseInt(process.env.PORT || '3000', 10); // 10 bedeutet: Lies die Zahl als normale Dezimalzahl.

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
});

// disconnect prisma when server stops
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
