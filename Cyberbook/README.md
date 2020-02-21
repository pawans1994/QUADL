# Cyberbook v0.1

THIS PROJECT IS NOT COMPLETE YET

This document contains instructions on setting up and installing a deployment or a development environment for the components present in github
To get a better overview and the entire installation and usage guide please go to the google drive document https://docs.google.com/document/d/1bCHC4CGaZhGRtpVYoMFpQDbG1r7d4UbzK1EzeFf0wxY/edit

## Folder Structure
* `Cyberbook` - This is the parent folder for the project
  * `SimStudentServlet` - This is the parent folder containing the SimStudentServlet Project
      * `Deploy` - This folder contains the deployment version of the SimStudentServlet project to a tomcat server
      * `Project` - This folder contains the SimStudentServlet project to setup a development environment
  * `ModelTracer` - The header file containing the implementation of the subset of the MPI functions
      * `Deploy` - This folder contains the jar file of the ModelTracer project to be used for deployment in conjunction with SimStudentServlet
      * `Project` - This folder contains the ModelTrace.r project to setup a development environment
  * `XBlocks` - This folder contains the various XBlocks required for the Cyberbook installation to complete

## Instructions to Deploy
Please follow the below instructions to deploy a working version of the Cyberbook components

### Prerequisites
1. A modern version of OpenEdx (devstack/fullstack)
2. An installation of a tomcat server (version used here is 7.0.99)
    Please note - We refer to tomcat parent directory as TOMCAT_HOME for the rest of this document
3. Java 8

### Installation
#### SimStudentServlet and ModelTracer
1. Clone the repository onto your local machine
2. We are only concerned with the Cyberbook folder in this document
3. Copy the deployment version of SimStudentServlet from the folder `PASTEL/Cyberbook/SimStudentServlet/Deploy`
4. Paste it inside the `webapps` folder of your tomcat installation
  `TOMCAT_HOME/webapps/`
5. Navigate back to the Cyberbook folder and copy the ModelTracer jar file from the below folder
  `PASTEL/Cyberbook/ModelTracer/Deploy`
6. Paste it inside the SimStudentServlet in your tomcat installation in the below path
  `TOMCAT_HOME/webapps/SimStudentServlet/WEB-INF/lib`
    If the file already exists, replace it. This will ensure you are running the lates build of ModelTracer
7. Open the terminal and run the below commands
  1. `cd TOMCAT_HOME/bin/`
  2. `sudo ./startup.sh`
  3.  At the time of writing this document SimStudentServlet required Port 8080 to run
      You can try to run SimStudentServlet on the default tomcat port
      If it does not work check out this answer to configure your tomcat installation on port 8080
      https://stackoverflow.com/questions/18415578/how-to-change-tomcat-port-number
      To reflect the changes stop the server using `./shutdown.sh`
      And start it again.
8. Open your browser and enter the url http://localhost:8080/SimStudentServlet

On more information on how to use SimStudentServlet follow this document https://docs.google.com/document/d/1bCHC4CGaZhGRtpVYoMFpQDbG1r7d4UbzK1EzeFf0wxY/edit


#### XBlocks


## Instructions to Setup the development environment

### Prerequisites
1. A modern version of OpenEdx (devstack/fullstack)
2. An installation of a tomcat server (version used here is 7.0.99)
3. Java 8
4. Eclipse

### Installation
#### SimStudentServlet and ModelTracer
1. Open Eclipse and right click on the project navigation pane.
2. Import the SimStudentServlet and ModelTracer projects on your workspace
    If you are using the same version of eclipse as was being used when this document was written, follow the instructions provided in this document https://docs.google.com/document/d/1bCHC4CGaZhGRtpVYoMFpQDbG1r7d4UbzK1EzeFf0wxY/edit. To import the projects
    If you are using a different version you will have to figure out how to import a project to eclipse for your version.
    Below are the locations of the ModelTracer and SimStudentServlet projects

    ModelTracer - `PASTEL/Cyberbook/ModelTracer/Project`
    SimStudentServlet - `PASTEL/Cyberbook/SimStudentServlet/Project`

3. Once the projects have been imported you can begin making your own changes.

* Follow the below instructions to deploy and test your changes.
1. Export the SimStudentServlet project as a war file and put it in `TOMCAT_HOME/webapps/`
2. Export the ModelTracer project as a jar file and put it in the folder `TOMCAT_HOME/webapps/SimStudentServlet/WEB-INF/lib`
3. Start and stop the tomcat server following the same method as you did to deploy the SimStudentServlet code.


#### XBlocks



## Versioning of this project


## Links to other documents
