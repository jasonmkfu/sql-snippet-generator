IF OBJECT_ID('tempdb..#{1}') IS NOT NULL
	BEGIN
	   DROP TABLE #{1};
  END;

SELECT * INTO #{1} FROM (

) AS {1};