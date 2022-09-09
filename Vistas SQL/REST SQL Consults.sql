/**
* Creación de Usuario SS con todo los permisos
**/
CREATE USER 'SS'@'localhost' IDENTIFIED VIA mysql_native_password USING '***';
GRANT ALL PRIVILEGES ON *.* TO 'SS'@'localhost' REQUIRE NONE WITH GRANT OPTION
    MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `pgenx-cmsqb`.* TO 'SS'@'localhost';

/**
* Tabla para almacenar la información eliminada por el usuario 
* en caso de recuperación + un status de por que y quien fue eliminada.
**/
CREATE TABLE data_delete LIKE data;
ALTER TABLE "data_delete" ADD "Status" VARCHAR(250) NOT NULL ;


/**
* Tabla para almacenar los cambios y que sean efectuados por Pedro en cms
**/

CREATE TABLE temp_cms LIKE data;
ALTER TABLE temp_cms 
DROP COLUMN Invoice_Number,
DROP COLUMN Date_invoice_recieved,
DROP COLUMN Date_Quickbooks_Processed;

/**
* Tabla para almacenar los cambios y que sean efectuados por Pedro en qb
**/

CREATE TABLE temp_qb LIKE data;
ALTER TABLE temp_qb 
DROP COLUMN Date_CSM_Processed, DROP COLUMN NamePDF;

CREATE TABLE data_delete LIKE data;
ALTER TABLE "data_delete" ADD "Status" VARCHAR(250) NOT NULL ;

/**
* Tabla para almacenar los cambios hechos por el usuario y los comentarios 
**/

CREATE TABLE userlogs(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    USER int NOT NULL, ROL varchar(255) NOT NULL,
    ACTION varchar(255) NOT NULL,
    DATEACTION varchar(255) NOT NULL,
    IDDATA int NOT NULL ,
    IDPO int NOT NULL,
    IDINVOICE int NOT NULL,
    COMMENTS varchar(255) NOT NULL 
);

/**
* Información en la que Pedro no proceso por que no ha encontrado la factura 
* Se debe mostrar para realizarla de forma Manual.
*/
DROP PROCEDURE IF EXISTS cmsupmanualprocedure//
CREATE PROCEDURE cmsupmanualprocedure()
BEGIN
    SELECT ID,PO_Number FROM data
	WHERE Date_CSM_Processed="" AND PO_Number!="";
END;//

call cmsupmanualprocedure()

/**
* TESTING DELETING METHOD CMS
*/
INSERT INTO `data`(
    `ID`,
    `PO_Number`,
    `Date_CSM_Processed`,
    `PDF_Name`,
    `Invoice_Number`,
    `Date_invoice_recieved`,
    `Date_Quickbooks_Processed`,
    `NamePDF`
    )
    VALUES (
        '515',
        '22200B_Misc',
        '',
        '',
        '48128',
        '08/02/2022 03:19:23',
        null,
        null
)