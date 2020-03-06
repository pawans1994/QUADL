set DORMINJAR=..\..\lib\ctat.jar
set CPATH=%DORMINJAR%;..;.
set VMOPTION=-cp %CPATH% -Xmx512m -DssFoilBase=../../FOIL6
set TUTORARG=-debugCodes miss ss -traceLevel 5
set TUTORARG=%TUTORARG% -ssProjectDir .
set TUTORARG=%TUTORARG% -ssPackageName YOUR_PACKAGE_NAME
set TUTORARG=%TUTORARG% -ssInputMatcher edu.cmu.pact.miss.userDef.algebra.IsEquivalent
echo java %VMOPTION% %1 %TUTORARG%
java %VMOPTION% %1 %TUTORARG%