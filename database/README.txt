================ FILE STRUCTURES ================

*DDML - Data definition language / Data manipulation language

Scripts to create and modify the structure of database objects in database. Also includes scripts to retrieve, store, modify, delete, insert and update data in database.

Examples: CREATE, ALTER, DROP, SELECT, UPDATE, INSERT statements

*DCL - Data control language

Scripts that create roles, and permissions as well as scripts that is used to control access to database.

Examples: GRANT, REVOKE statements

*StoredProcedures

Scripts that creates Stored Procedures

*Views

Scripts that creates Views

*Functions

Scripts that creates user define functions.


================ FILES ================

*liquibase.properties

Contains Liquibase' default options values

*mysql-connector-java-5.1.34-bin.jar

When "classpath" option is being used in liquibase.properties file, it always use the current directory. A workaround is to include this file in the current directory.

*main.changelog.xml

changelogs included in this file:

- main.dcl.xml
- main.ddml.xml
- main.views.xml
- main.func.xml
- main.sp.xml

*main.<dcl|ddml|view|func|sp>.xml

changelogs included in this file:

- dcl.<xx.xxx.xx>.xml
- ddml.<xx.xxx.xx>.xml
- vw.<view name>.xml
- func.<function name>.xml
- sp.<stored procedure name>.xml




