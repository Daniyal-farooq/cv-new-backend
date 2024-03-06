const { response } = require('express');
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');


const app = express();

// Read the Handlebars template from a separate file
const templatePath = `${__dirname}/template.hbs`;
const templateContent = fs.readFileSync(templatePath, 'utf8');
const template = handlebars.compile(templateContent);

// SET UP MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var bodyParser = require('body-parser')
app.use(cors()); // Use cors middleware
app.use(bodyParser.json())




app.post('/', (req, res, next) => {
    console.log("theme: ", req.body);
    res.json({
        success: true,
        message: 'PDF generated successfully',
      });

});


app.post('/generate-pdf', async (req, res) => {
    try {
      const { jsonData } = req.body;
  
      // Inject data into the Handlebars template
      const html = template(jsonData);
  
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      // Set the HTML content of the page
      await page.setContent(html);
  
      // Generate PDF
      const pdfBuffer = await page.pdf({ format: 'A4' });
  
      // Close browser
      await browser.close();
  
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated-pdf.pdf');
  
      // Send PDF as response
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


app.get('/resume-maker/:theme', (req, res, next) => {
    console.log("theme: ", req.params.theme);

});




const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server is running on : ' + port));