const getExampleData = (req, res) => {
    res.json({ message: 'This is example data from the server.' });
  };
  
  module.exports = { getExampleData }; // Export function using CommonJS
  