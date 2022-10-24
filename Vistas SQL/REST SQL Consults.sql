/**
* Creación de Usuario SS con todo los permisos
**/
CREATE USER 'SS'@'localhost' IDENTIFIED VIA mysql_native_password
USING '***';GRANT SELECT, INSERT, UPDATE, DELETE, FILE, CREATE TEMPORARY TABLES,
CREATE VIEW, SHOW VIEW, EXECUTE ON *.* TO 'SS'@'localhost'
REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
  
GRANT ALL PRIVILEGES ON `mysql`.* TO 'SS'@'localhost';

/**
* Tabla para almacenar la información eliminada por el usuario 
**/
CREATE TABLE IF NOT EXISTS restore LIKE data;

/**
* Notificación a pedro de que el usuario o cliente local ha realizado un cambio.
* 0: Sin cambio
* 1: Se realiza cambio
**/

CREATE TABLE IF NOT EXISTS observablePedro(
    STATUS INT NOT NULL);

INSERT INTO observablePedro values(0);

CREATE TABLE IF NOT EXISTS user(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
    name varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    rol varchar(255) NOT NULL,
    createdAt varchar(255) NOT NULL,
    updateAt varchar(255)
);

/**
* Tabla para almacenar los cambios hechos por el usuario y los comentarios 
**/

CREATE TABLE IF NOT EXISTS userlog(
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(255) NOT NULL,
    ROL varchar(255) NOT NULL,
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
DELIMITER //
DROP PROCEDURE IF EXISTS cmsupmanualprocedure//
CREATE PROCEDURE cmsupmanualprocedure()
BEGIN
    SELECT ID,PO_Number,Date_CSM_Processed FROM data
	WHERE (Date_CSM_Processed="" OR Date_CSM_Processed IS NULL) AND (PO_Number IS NOT NULL OR PO_Number=!'');
END;//
DELIMITER ;

--call cmsupmanualprocedure()

/**
* Información en la que Pedro Calidad QB no proceso por que no ha encontrado la PO_NUMBER 
* Se debe mostrar para realizarla de forma Manual.
*/

DELIMITER //
DROP PROCEDURE IF EXISTS qbmanually//
CREATE PROCEDURE qbmanually()
BEGIN
    SELECT a.ID,a.PO_Number,a.Invoice_Number,a.Date_invoice_recieved,a.Date_Quickbooks_Processed, a.NamePDF
    FROM ( 
        SELECT ID,PO_Number,Invoice_Number,Date_invoice_recieved, Date_Quickbooks_Processed, NamePDF FROM data
        WHERE (Invoice_Number IS NULL AND Date_invoice_recieved<>'')
              OR Date_invoice_recieved='' 
              OR Date_Quickbooks_Processed='' 
              OR NamePDF='' 
              OR Date_invoice_recieved IS NULL 
              OR Date_Quickbooks_Processed IS NULL 
              OR NamePDF IS NULL
    ) a
        LEFT JOIN (
            SELECT ID, COUNT(Invoice_Number) AS Repeticiones FROM DATA 
            WHERE Invoice_Number!=0 OR Invoice_Number IS NOT NULL 
            GROUP BY Invoice_Number
            HAVING Repeticiones > 1
        ) b ON (a.ID = b.ID)
     GROUP BY ID;
END//
DELIMITER ;

--call qbmanually();

/**
* Información en la que Pedro Calidad QB no proceso por que no ha encontrado la PO_NUMBER 
* Se debe mostrar para realizarla de forma Manual.
*/

DELIMITER //
DROP PROCEDURE IF EXISTS qbduplicated//
CREATE PROCEDURE qbduplicated()
BEGIN
    SELECT ID, COUNT(Invoice_Number) AS Repeticiones FROM DATA 
        WHERE Invoice_Number!=0 OR Invoice_Number IS NOT NULL 
        GROUP BY Invoice_Number
        HAVING Repeticiones > 1;
END//
DELIMITER ;

--call qbduplicated();

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

--call DelayQb();

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

--call DaysSince();
    
DELIMITER //
DROP PROCEDURE IF EXISTS masterdata//
CREATE PROCEDURE masterdata()
BEGIN 
    SELECT a.ID,a.PO_Number,a.Date_CSM_Processed,a.PDF_Name,CAST(a.Invoice_Number AS varchar(255)) AS Invoice_Number,a.Date_invoice_recieved,a.Date_Quickbooks_Processed,a.NamePDF,b.DaysSince,c.DelayQb,d.InvoiceObj, e.PO_NumberObj, f.IDObject, f.comment
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
        SELECT CAST(InvoiceNumber AS UNSIGNED INTEGER) as InvoiceObj
	    FROM Invoices
	    GROUP BY InvoiceObj    
    ) d ON(a.Invoice_Number = d.InvoiceObj) LEFT JOIN (
        SELECT da.PO_Number as PO_NumberObj
	    FROM data da, LabResults l
	    WHERE l.PONumber = CONCAT("PO # ",da.PO_Number)
        GROUP BY PO_Number
    ) e ON(a.PO_NUMBER = e.PO_NumberObj) LEFT JOIN (
        SELECT daf.ID as IDObject, uslog.comment as comment
	    FROM data daf, userlog uslog
	    WHERE daf.ID = uslog.IDRESTORE and uslog.COMMENT !=""
        ORDER BY uslog.ID DESC LIMIT 1
    ) f ON(a.ID = f.IDObject) GROUP BY ID;    
END//
DELIMITER ;

--CALL masterdata();

/**
*
**/
DELIMITER //
DROP PROCEDURE IF EXISTS restore_data//
CREATE PROCEDURE restore_data()
BEGIN 
    SELECT b.id,a.ID AS MDID,a.PO_Number,a.Date_CSM_Processed,a.PDF_Name,a.Invoice_Number,a.Date_invoice_recieved,a.Date_Quickbooks_Processed,a.NamePDF,b.action, b.date_action
    FROM restore a, userlog b
    WHERE a.ID = b.idrestore;
END//
DELIMITER ;

--CALL restore_data();

/**
*
**/
DELIMITER //

DROP PROCEDURE IF EXISTS update_cms_format//
CREATE PROCEDURE update_cms_format()
BEGIN

  DECLARE var_id INTEGER;
  DECLARE var_cms_date varchar(255);

  DECLARE var_final INTEGER DEFAULT 0;

  DECLARE new_format CURSOR FOR
  SELECT ID, 
    if(Date_CSM_Processed = '','', DATE_FORMAT(STR_TO_DATE(Date_CSM_Processed, '%m/%d/%Y %H:%i:%s'), '%m/%d/%Y %H:%i:%s')) AS new_date
  FROM data;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_final = 1;

  OPEN new_format;

  bucle: LOOP

    FETCH new_format INTO var_id, var_cms_date;

    IF var_final = 1 THEN
      LEAVE bucle;
    END IF;

    UPDATE data SET Date_CSM_Processed = var_cms_date WHERE ID = var_id;

  END LOOP bucle;
  CLOSE new_format;
END//
DELIMITER ;

CALL update_cms_format();


/**
*
**/
SELECT ID,DATE 
FROM invoices
WHERE DATE LIKE '%A%' OR DATE LIKE '%P%';


/**
*
**/
DELIMITER //

DROP PROCEDURE IF EXISTS update_invoice_format//
CREATE PROCEDURE update_invoice_format()
BEGIN

  DECLARE var_id INTEGER;
  DECLARE var_invoice_date varchar(255);

  DECLARE var_final INTEGER DEFAULT 0;

  DECLARE new_format CURSOR FOR
  SELECT ID, 
         if(Date_invoice_recieved = '','', DATE_FORMAT(STR_TO_DATE(Date_invoice_recieved, '%m/%d/%Y %H:%i:%s'), '%m/%d/%Y %H:%i:%s')) AS new_date
  FROM data
  WHERE Date_invoice_recieved LIKE '%/%/%';

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_final = 1;

  OPEN new_format;

  bucle: LOOP

    FETCH new_format INTO var_id, var_invoice_date;

    IF var_final = 1 THEN
      LEAVE bucle;
    END IF;

    UPDATE data SET Date_invoice_recieved = var_invoice_date WHERE ID = var_id;

  END LOOP bucle;
  CLOSE new_format;
END//
DELIMITER ;

CALL update_invoice_format();

/**
*
**/
DELIMITER //

DROP PROCEDURE IF EXISTS update_qb_format//
CREATE PROCEDURE update_qb_format()
BEGIN

  DECLARE var_id INTEGER;
  DECLARE var_qb_date varchar(255);

  DECLARE var_final INTEGER DEFAULT 0;

  DECLARE new_format CURSOR FOR
  SELECT ID, 
         if(Date_Quickbooks_Processed = '','', DATE_FORMAT(STR_TO_DATE(Date_Quickbooks_Processed, '%m/%d/%Y %H:%i:%s'), '%m/%d/%Y %H:%i:%s')) AS new_date
  FROM data
  WHERE Date_Quickbooks_Processed LIKE '%/%/%';

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_final = 1;

  OPEN new_format;

  bucle: LOOP

    FETCH new_format INTO var_id, var_qb_date;

    IF var_final = 1 THEN
      LEAVE bucle;
    END IF;

    UPDATE data SET Date_Quickbooks_Processed = var_qb_date WHERE ID = var_id;

  END LOOP bucle;
  CLOSE new_format;
END//
DELIMITER ;

CALL update_qb_format();

/**
*
**/
SELECT ID,DATE 
FROM labresults
WHERE DATE LIKE '%A%' OR DATE LIKE '%P%';

/**
*
*
**/
DELIMITER //

DROP PROCEDURE IF EXISTS update_labresults_format//
CREATE PROCEDURE update_labresults_format()
BEGIN

  DECLARE var_id INTEGER;
  DECLARE var_labresult_date varchar(255);

  DECLARE var_final INTEGER DEFAULT 0;

  DECLARE new_format CURSOR FOR
  SELECT ID, 
         if(Date = '','', DATE_FORMAT(STR_TO_DATE(Date, '%m/%d/%Y %H:%i:%s'), '%m/%d/%Y %H:%i:%s')) AS new_date
  FROM labresults;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_final = 1;

  OPEN new_format;

  bucle: LOOP

    FETCH new_format INTO var_id, var_labresult_date;

    IF var_final = 1 THEN
      LEAVE bucle;
    END IF;

    UPDATE labresults SET Date = var_labresult_date WHERE ID = var_id;

  END LOOP bucle; 
  CLOSE new_format;
END//
DELIMITER ;

CALL update_labresults_format()