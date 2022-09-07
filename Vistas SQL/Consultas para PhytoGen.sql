
/**
* NAME: CMS_PERFORMANCE
* Estados de Laboratorio Genericos
**/
Qry_CMS_Performance
============================
SELECT LabResults_0.PDFName, LabResults_0.PONumber, MIN(STR_TO_DATE(LabResults_0.Date, '%m/%d/%Y %H:%i:%s')) AS DateStart, MAX(STR_TO_DATE(LabResults_0.Date, '%m/%d/%Y %H:%i:%s')) AS DateEnd, 
	COUNT(DISTINCT LabResults_0.PONumber) AS CountPO, COUNT(DISTINCT LabResults_0.SubloteCode) AS CountSublote, COUNT(1) AS TestCount, SUM(IF(LabResults_0.State='Complete',0,1)) AS CountIssue
FROM `pgenx-cmsqb`.LabResults LabResults_0 
Group by LabResults_0.PDFName
ORDER BY 3

/**
* Estado de Resultados de Laboratorios Especificos.
* Primary Key PO_Number
**/
QryCMS_Data
===========================
SELECT LabResults_0.ID, STR_TO_DATE(LabResults_0.Date, '%m/%d/%Y %H:%i:%s') AS Date, LabResults_0.PDFName, LabResults_0.PONumber, LabResults_0.SubloteCode, LabResults_0.Test, LabResults_0.State
FROM `pgenx-cmsqb`.LabResults LabResults_0
ORDER BY LabResults_0.ID


Qry_MasterData
===========================
SELECT Data_0.ID, Data_0.PO_Number, STR_TO_DATE(Data_0.Date_CSM_Processed, '%m/%d/%Y %H:%i:%s') AS Date_CSM_Processed, Data_0.PDF_Name, Data_0.NamePDF as OutputPDF, NULLIF (Data_0.Invoice_Number, 0) as Invoice_Number, STR_TO_DATE(Data_0.Date_invoice_recieved, '%m/%d/%Y %H:%i:%s') Date_invoice_recieved, STR_TO_DATE(Data_0.Date_Quickbooks_Processed, '%m/%d/%Y %H:%i:%s') AS Date_Quickbooks_Processed 
FROM `pgenx-cmsqb`.Data Data_0 where Data_0.ID>0
ORDER BY Data_0.ID


/**
* Estado final de la factura con intentos de RPA 
**/
Qry_QB_Performance
===========================
SELECT ID, STR_TO_DATE(Date, '%m/%d/%Y %H:%i:%s') AS LastDate_Try_Invoice, InvoiceNumber, Tries, PONumber AS LastPO_Related, State
FROM (
	SELECT MAX(ID) AS MAXID, COUNT(1) Tries
	FROM Invoices
	GROUP BY InvoiceNumber
) a 
INNER JOIN (
	SELECT ID, DATE, InvoiceNumber, PONumber, State
	FROM Invoices 
) b ON (a.MAXID=b.ID)

/**
* Detalle de Estado final de la factura.
* Primary Key InvoiceNumber
**/
Qry_QBData
===========================
SELECT Invoices_0.ID, STR_TO_DATE(Invoices_0.Date, '%m/%d/%Y %H:%i:%s') AS Date, Invoices_0.PONumber, Invoices_0.InvoiceNumber, Invoices_0.State
FROM `pgenx-cmsqb`.Invoices Invoices_0
ORDER BY Date
