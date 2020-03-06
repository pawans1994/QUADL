V1: x+7, 11, x+5, x, 4, -1, 10.
V4: subtract 7, subtract 5.

subtract(V1, V4) ##
x+7, subtract 7
11, subtract 7
.
*HasVarTerm(V1) #
x+7
x+5
;
x
11
4
-1
10
.
*IsNumeratorOf(V1, V1) ##
;
x, x+7
x+7, x
x+7, 11
4, 11
4, x
x+7, 4
4, x+7
11, x
11, x+7
11, 4
x, 11
x, 4
-1, x
-1, 4
x, -1
4, -1
11, 10
x+5, 10
x+5, 11
10, x+5
10, x+7
x+7, x+5
10, 11
x+7, 10
11, x+5
x+5, x+7
.
*IsFractionTerm(V1) #
;
x+7
x
11
4
-1
10
x+5
.
*IsAVarTerm(V1) #
x
;
x+7
11
4
-1
10
x+5
.
*IsSkillAdd(V4) #
;
subtract 7
subtract 5
.
*IsLastConstTermNegative(V1) #
;
x+7
x
11
4
-1
10
x+5
.
*HasCoefficient(V1) #
;
x+7
x
11
4
-1
10
x+5
.
*IsConstant(V1) #
11
4
-1
10
;
x+7
x
x+5
.
*IsPolynomial(V1) #
x+7
x+5
;
x
11
4
-1
10
.
*IsDenominatorOf(V1, V1) ##
;
x, x+7
x+7, x
x+7, 11
4, 11
4, x
x+7, 4
4, x+7
11, x
11, x+7
11, 4
x, 11
x, 4
-1, x
-1, 4
x, -1
4, -1
11, 10
x+5, 10
x+5, 11
10, x+5
10, x+7
x+7, x+5
10, 11
x+7, 10
11, x+5
x+5, x+7
.
*HasParentheses(V1) #
;
x+7
x
11
4
-1
10
x+5
.
*IsSkillSubtract(V4) #
subtract 7
subtract 5
.
*IsSkillMultiply(V4) #
;
subtract 7
subtract 5
.
*Homogeneous(V1) #
x
11
4
-1
10
;
x+7
x+5
.
*NotNull(V1) #
x+7
x
11
4
-1
10
x+5
.
*Monomial(V1) #
x
11
4
-1
10
;
x+7
x+5
.
*HasConstTerm(V1) #
x+7
11
4
-1
10
x+5
;
x
.
*IsSkillDivide(V4) #
;
subtract 7
subtract 5
.

