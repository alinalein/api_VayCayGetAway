require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/db');
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
});

// disconnect prisma when server stops
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
