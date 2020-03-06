#!/bin/bash

echo ${OS}
echo ${JAVA_HOME}

# 
## Change these variables 
#

if [ "${CVSDIR}" = "" ]
then
	if [ "${OS}" = "Windows_NT" ]
	then
		CVSDIR="f:/Project/CTAT/CVS-TREE"
	fi
	if [ "${OS}" != "Windows_NT" ]
	then
		CVSDIR="${HOME}/mazda-on-Mac/Project/CTAT/CVS-TREE"
	fi
fi

JAVAC="javac"

#
## Don't change following codes
#
if [ "${OS}" = "Windows_NT" ]
then
	CPS=";"
fi
if [ "${OS}" != "Windows_NT" ]
then
	CPS=":"
fi

DorminJar="../../lib/ctat.jar${CPS}../../lib/jess.jar"
CPATH="${DorminJar}${CPS}..${CPS}."

VmOption="-classpath ${CPATH}"

#echo compiling Tutor interface
#echo ${JAVAC} ${VmOption} ThreeStepEq.java
#${JAVAC} ${VmOption} ThreeStepEq.java

echo compiling UserDefSymbols...
echo ${JAVAC} ${VmOption} UserDefSymbols.java
"${JAVAC}" ${VmOption} UserDefSymbols.java

#echo compiling AlgebraOneAdhocFoaGetter...
#echo ${JAVAC} ${VmOption} AlgebraOneAdhocFoaGetter.java
#${JAVAC} ${VmOption} AlgebraOneAdhocFoaGetter.java

