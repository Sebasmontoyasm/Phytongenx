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
);

/**
* Información en la que Pedro no proceso por que no ha encontrado la factura 
* Se debe mostrar para realizarla de forma Manual.
*/
DELIMITER
DROP PROCEDURE IF EXISTS cmsupmanualprocedure//
CREATE PROCEDURE cmsupmanualprocedure()
DELIMITER //
BEGIN
    SELECT ID,PO_Number FROM data
	WHERE Date_CSM_Processed="" AND PO_Number!="";
END;//
DELIMITER ;

call cmsupmanualprocedure()

/**
* Backup archivos eliminados en cms
* Posibilemente para todo
*/
DELIMITER //
DROP PROCEDURE IF EXISTS databackup//
CREATE PROCEDURE databackup(IN searchid INT)
BEGIN
    INSERT INTO data_delete
    SELECT ID,PO_Number,Date_CSM_Processed,PDF_Name,Invoice_Number,Date_invoice_recieved,Date_Quickbooks_Processed,NamePDF FROM data
    WHERE ID = searchid;

    SELECT * FROM data_delete;
END//
DELIMITER ;

call databackup(515);

/**
* Información en la que Pedro Calidad QB no proceso por que no ha encontrado la PO_NUMBER 
* Se debe mostrar para realizarla de forma Manual.
*/

DELIMITER //
DROP PROCEDURE IF EXISTS qbmanually//
CREATE PROCEDURE qbmanually()
BEGIN
    SELECT ID,PO_Number,Invoice_Number,Date_CSM_Processed FROM data
    WHERE Invoice_Number="" AND Date_CSM_Processed!="";
END//
DELIMITER ;

call qbmanually();

/**
* Información en la que Pedro Calidad QB no proceso por que no ha encontrado la PO_NUMBER 
* Se debe mostrar para realizarla de forma Manual.
*/

DELIMITER //
DROP PROCEDURE IF EXISTS qbduplicated//
CREATE PROCEDURE qbduplicated()
BEGIN
    SELECT ID,PO_Number,Invoice_Number,Date_CSM_Processed, COUNT(Invoice_Number) FROM data
    WHERE Invoice_Number="" AND Date_CSM_Processed!=""
    GROUP BY Invoice_Number;

END//
DELIMITER ;
