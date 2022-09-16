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

call qbduplicated();

/**
* DelayQb es el tiempo que obtiene las PO que no han sido procesadas por Pedro Invoice 
* No se encontro la factura correspondiente a esa PO.
**/

DELIMITER //
DROP PROCEDURE IF EXISTS DelayQb//
CREATE PROCEDURE DelayQb()
BEGIN
    SELECT ID, DATEDIFF(STR_TO_DATE(Date_Quickbooks_Processed, '%m/%d/%Y'),STR_TO_DATE(Date_invoice_recieved, '%m/%d/%Y')) AS DelayQb
    FROM data
    WHERE (Date_Quickbooks_Processed!="" OR Date_invoice_recieved !="") AND (Date_Quickbooks_Processed!="" AND Date_invoice_recieved !="");
END//
DELIMITER ;

call DelayQb()();

/**
* Daysince son los dias que han pasado sin que se halla encontrado una PO
* Relacionada a una Factura Existente.
* Se retiraron las que se realizarón manual que no tienen ni Invonce ni PO
**/

DELIMITER //
DROP PROCEDURE IF EXISTS DaysSince//
CREATE PROCEDURE DaysSince()
BEGIN
    SELECT ID,DATEDIFF(CURRENT_DATE,STR_TO_DATE(Date_invoice_recieved, '%m/%d/%Y')) as DaysSince
	FROM data
    WHERE Date_CSM_Processed="" AND Date_invoice_recieved!="";
END//
DELIMITER ;

call DaysSince();
    
DELIMITER //
DROP PROCEDURE IF EXISTS masterdata//
CREATE PROCEDURE masterdata()
BEGIN 
    SELECT a.ID,a.PO_Number,a.Date_CSM_Processed,a.PDF_Name,a.Invoice_Number,a.Date_invoice_recieved,a.Date_Quickbooks_Processed,a.NamePDF,b.DaysSince,c.DelayQb,d.InvoiceObj, e.PO_NumberObj, f.IDObject, f.comments
	FROM (
        SELECT ID,PO_Number,Date_CSM_Processed,PDF_Name,Invoice_Number,Date_invoice_recieved,Date_Quickbooks_Processed,NamePDF
        FROM data
	) a 
	LEFT JOIN (
		SELECT ID,DATEDIFF(CURRENT_DATE,STR_TO_DATE(Date_invoice_recieved, '%m/%d/%Y')) as DaysSince
	    FROM data
        WHERE Date_CSM_Processed="" AND Date_invoice_recieved!=""
	) b ON (a.ID = b.ID) LEFT JOIN (
        SELECT ID, DATEDIFF(STR_TO_DATE(Date_Quickbooks_Processed, '%m/%d/%Y'),STR_TO_DATE(Date_invoice_recieved, '%m/%d/%Y')) AS DelayQb
        FROM data
        WHERE (Date_Quickbooks_Processed!="" OR Date_invoice_recieved !="") AND (Date_Quickbooks_Processed!="" AND Date_invoice_recieved !="")
    ) c ON(a.ID = c.ID) LEFT JOIN (
        SELECT CAST(InvoiceNumber AS INT) as InvoiceObj
	    FROM Invoices
	    GROUP BY InvoiceObj    
    ) d ON(a.Invoice_Number = d.InvoiceObj) LEFT JOIN (
        SELECT da.PO_Number as PO_NumberObj
	    FROM data da, LabResults l
	    WHERE l.PONumber = CONCAT("PO # ",da.PO_Number)
        GROUP BY PO_Number
    ) e ON(a.PO_NUMBER = e.PO_NumberObj) LEFT JOIN (
        SELECT daf.ID as IDObject, uslog.comments as comments
	    FROM data daf, userlogs uslog
	    WHERE daf.ID = uslog.IDDATA and uslog.COMMENTS !=""
    ) f ON(a.ID = f.IDObject) GROUP BY ID;    
END//
DELIMITER ;

CALL masterdata();


