const fs = require('fs');
const path = require('path');

const databaseFile = path.join(__dirname, '..', 'database.sqlite');

function clearDatabase() {
  try {
    if (fs.existsSync(databaseFile)) {
      fs.unlinkSync(databaseFile);
      console.log('Database file deleted successfully.');
    } else {
      console.log('Database file does not exist. Nothing to delete.');
    }
  } catch (error) {
    console.error('Error deleting database file:', error);
  }
}

clearDatabase();

