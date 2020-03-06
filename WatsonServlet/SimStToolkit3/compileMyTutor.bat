set JAVAC= %JAVA_HOME%\bin\javac
set DORMINJAR=..\..\lib\ctat.jar
set CPATH=%DORMINJAR%;..;.
echo cpath = %CPATH%
set VMOPTION=-classpath %CPATH%
echo compiling UserDefSymbols...
echo %JAVAC% %VMOPTION% UserDefSymbols.java
javac %VMOPTION% UserDefSymbols.java
