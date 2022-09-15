/**
* NAME: CMS_PERFORMANCE
* Estados de Laboratorio Genericos
* @Co-Author: Sebastian Montoya
* @Update: 14/09/2022
**/
CMS_Performance
============================

DELIMITER //
DROP PROCEDURE IF EXISTS cms_performance//
CREATE PROCEDURE cms_performance()
BEGIN
    SELECT PDFName, PONumber,MIN(Date) AS DateStart, MAX(Date) AS DateEnd, 
	COUNT(DISTINCT PONumber) AS CountPO, COUNT(DISTINCT SubloteCode) AS CountSublote, COUNT(1) AS TestCount, SUM(IF(State='Complete',0,1)) AS CountIssue
	FROM LabResults
	Group by PDFName
	ORDER BY 3;
END//
DELIMITER ;

call cms_performance()

/**
* PO Numbers a las que se les debe agregar el Link de acceso en Master Data Page
* en MasterData
* Primary Key PO_Number
* @Author: Sebastian Montoya
* @Update: 14/09/2022
**/

CMS_Data_Objetives
===========================
DELIMITER //
DROP PROCEDURE IF EXISTS cms_data_objetives//
CREATE PROCEDURE cms_data_objetives()
BEGIN
    SELECT PONumber
	FROM LabResults
	GROUP BY PONumber;
END//
DELIMITER ;

call cms_data_objetives();

/**
* Estado de Resultados de Laboratorios Especificos.
* Primary Key PO_Number
* @Co-Author: Sebastian Montoya
* @Update: 14/09/2022
**/

CMS_Data
===========================

DELIMITER //
DROP PROCEDURE IF EXISTS cms_data//
CREATE PROCEDURE cms_data(IN PONUM VARCHAR(255))
BEGIN
    SELECT ID, Date, PDFName, PONumber, SubloteCode, Test, State
	FROM LabResults
	WHERE PONumber LIKE concat('%',PONUM)
	ORDER BY ID;
END//
DELIMITER ;

call cms_data('22167F');


/**
* ?? PREGUNTAR
**/
Qry_MasterData
===========================
SELECT Data_0.ID, Data_0.PO_Number, STR_TO_DATE(Data_0.Date_CSM_Processed, '%m/%d/%Y %H:%i:%s') AS Date_CSM_Processed, Data_0.PDF_Name, Data_0.NamePDF as OutputPDF, NULLIF (Data_0.Invoice_Number, 0) as Invoice_Number, STR_TO_DATE(Data_0.Date_invoice_recieved, '%m/%d/%Y %H:%i:%s') Date_invoice_recieved, STR_TO_DATE(Data_0.Date_Quickbooks_Processed, '%m/%d/%Y %H:%i:%s') AS Date_Quickbooks_Processed 
FROM `pgenx-cmsqb`.Data Data_0 where Data_0.ID>0
ORDER BY Data_0.ID

/**
* Estado final de la factura con intentos de RPA 
* NAME: QB_PERFORMANCE
* Estados de Facturación Genericos
* @Co-Author: Sebastian Montoya
* @Update: 14/09/2022
**/
QB_Performance
===========================

DELIMITER //
DROP PROCEDURE IF EXISTS qb_performance//
CREATE PROCEDURE qb_performance()
BEGIN
   SELECT ID, Date AS LastDate, InvoiceNumber, Tries, PONumber AS LastPO, State
	FROM (
		SELECT MAX(ID) AS MAXID, COUNT(1) Tries
		FROM Invoices
		GROUP BY InvoiceNumber
	) a 
	INNER JOIN (
		SELECT ID, DATE, InvoiceNumber, PONumber, State
		FROM Invoices 
	) b ON (a.MAXID=b.ID);
END//
DELIMITER ;


call qb_performance();

/**
* Invoices a las que se les debe agregar el Link de acceso
* en MasterData
* Primary Key InvoiceNumber
* @Author: Sebastian Montoya
* @Update: 14/09/2022
**/

Data_Objetives
===========================
DELIMITER //
DROP PROCEDURE IF EXISTS qb_data_objetives//
CREATE PROCEDURE qb_data_objetives()
BEGIN
    SELECT InvoiceNumber, State
	FROM Invoices
	GROUP BY Invoice_Number;
END//
DELIMITER ;

call qb_data_objetives();

/**
* Detalle de Estado final de la factura.
* Primary Key InvoiceNumber
* @Co-Author: Sebastian Montoya
* @Update: 14/09/2022
**/
QBData
===========================

DELIMITER //
DROP PROCEDURE IF EXISTS qb_data//
CREATE PROCEDURE qb_data(IN INVN INT)
BEGIN
   SELECT ID, Date, PONumber, InvoiceNumber, State
	FROM Invoices
	WHERE InvoiceNumber = INVN
	ORDER BY Date;
END//
DELIMITER ;

call qb_data(47144);

