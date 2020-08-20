REM create a tag before updating the database. This is the reference point of the rollback if any error occurs in the script

start /wait D:\tools\liquibase\liquibase --url="jdbc:sqlserver://127.0.0.1:1433;omni?createDatabaseIfNotExist=true" --username="omi_webuser" --password="123456" tag v0.1


start /wait D:\tools\liquibase\liquibase --url="jdbc:sqlserver://127.0.0.1:1433;databaseName=omni" --username="omni_webuser" --password="123456" --defaultsFile="liquibase.properties" update

REM rollback the database to the point before the update is executed

start /wait D:\tools\liquibase\liquibase --url="jdbc:sqlserver://127.0.0.1:1433;databaseName=omni" --username="omni_webuser" --password="123456" rollback v1.0.0