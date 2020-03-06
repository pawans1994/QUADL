#!/bin/bash
#
# Shell Script to run SimStudent from a directory where you have your own Tutor Interface
#
# Copyright Noboru Matsuda, 2007
# Carnegie Mellon University 
# 
# Noboru.Matsuda@cs.cmu.edu
# 

echo ${OS}

# Class path
# 
DorminJar="../../lib/ctat.jar"

if [ "${OS}" = "Windows_NT" ]; then
    CPATH="${DorminJar};..;."
fi
if [ "${OS}" != "Windows_NT" ]; then
    CPATH="${DorminJar}:..:."
fi

VmOption="-cp ${CPATH} -Xmx512m -DssFoilBase=../../FOIL6"

# CTAT options
# 
TutorArg="-debugCodes miss ss  -traceLevel 5"
TutorArg="${TutorArg} -ssProjectDir ."
TutorArg="${TutorArg} -ssPackageName YOUR_PACKAGE_NAME"
TutorArg="${TutorArg} -ssInputMatcher edu.cmu.pact.miss.userDef.algebra.IsEquivalent"

cmd="java ${VmOption} $1 ${TutorArg}"

echo $cmd
$cmd
