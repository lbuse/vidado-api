# Webservice example in NodeJS

**This is a simple example of a webservice using SOAP protocol to expose a simple database (MariaDB) mimicking a food service chain structure.**

To see an examplo of a client application consuming this webservice, head over to this [repo](https://github.com/lbuse/projetovb "repo").

### Before Installing
Inside the directory `other_files` you will find:
- Two database files, one with just the structure e other with example data;
- An .env file example, required to initiate the server.
- A Postman collection with examples of requests available.

### Installing
1. Download and install Nodejs;
2. Clone the project to your local machine;
3. Open the terminal pointing to the root of the project;
4. Run the `npm i` command to install dependencies;
5. Create a .env file pointing to the database (there is an example in the other_files directory); 
5. Run the `npm start` to initiate the server.

If evertything went as espected, the server will be available at `http://localhost:3000/wsdl`