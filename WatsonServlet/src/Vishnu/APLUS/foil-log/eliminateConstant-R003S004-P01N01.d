V1: x+7, x, 11, 4, -1.
V4: subtract 7.

eliminateConstant(V1, V1) ##
x+7, 11
;
x, 4
.
*HasVarTerm(V1) #
x+7
;
11
4
x
-1
.
*IsNumeratorOf(V1, V1) ##
;
x+7, 11
4, 11
x+7, x
4, x
x+7, 4
4, x+7
11, x
11, x+7
11, 4
x, 11
x, 4
x, x+7
-1, x
-1, 4
x, -1
4, -1
.
*IsFractionTerm(V1) #
;
11
4
x+7
x
-1
.
*IsAVarTerm(V1) #
x
;
11
4
x+7
-1
.
*IsSkillAdd(V4) #
;
subtract 7
.
*IsLastConstTermNegative(V1) #
;
11
4
x+7
x
-1
.
*HasCoefficient(V1) #
;
11
4
x+7
x
-1
.
*IsConstant(V1) #
11
4
-1
;
x+7
x
.
*IsPolynomial(V1) #
x+7
;
11
4
x
-1
.
*IsDenominatorOf(V1, V1) ##
;
x+7, 11
4, 11
x+7, x
4, x
x+7, 4
4, x+7
11, x
11, x+7
11, 4
x, 11
x, 4
x, x+7
-1, x
-1, 4
x, -1
4, -1
.
*HasParentheses(V1) #
;
11
4
x+7
x
-1
.
*IsSkillSubtract(V4) #
subtract 7
.
*IsSkillMultiply(V4) #
;
subtract 7
.
*Homogeneous(V1) #
11
4
x
-1
;
x+7
.
*NotNull(V1) #
11
4
x+7
x
-1
.
*Monomial(V1) #
11
4
x
-1
;
x+7
.
*HasConstTerm(V1) #
11
4
x+7
-1
;
x
.
*IsSkillDivide(V4) #
;
subtract 7
.

