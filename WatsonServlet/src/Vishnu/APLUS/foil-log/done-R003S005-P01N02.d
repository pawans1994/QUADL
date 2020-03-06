V1: x, x+7, x+5, 4, 11, 10, -1.
V4: subtract 7, subtract 5.

done(V1, V1) ##
x, 4
;
x+7, 11
x+5, 10
.
*HasVarTerm(V1) #
x+7
x+5
;
-1
11
4
x
10
.
*IsNumeratorOf(V1, V1) ##
;
x+7, 11
4, 11
x+7, x
4, x
x+7, 4
4, x+7
-1, x
-1, 4
x, -1
11, x
11, x+7
11, 4
4, -1
x, 11
x, 4
x, x+7
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
-1
11
4
x+7
x
10
x+5
.
*IsAVarTerm(V1) #
x
;
-1
11
4
x+7
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
-1
11
4
x+7
x
10
x+5
.
*HasCoefficient(V1) #
;
-1
11
4
x+7
x
10
x+5
.
*IsConstant(V1) #
-1
11
4
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
-1
11
4
x
10
.
*IsDenominatorOf(V1, V1) ##
;
x+7, 11
4, 11
x+7, x
4, x
x+7, 4
4, x+7
-1, x
-1, 4
x, -1
11, x
11, x+7
11, 4
4, -1
x, 11
x, 4
x, x+7
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
-1
11
4
x+7
x
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
-1
11
4
x
10
;
x+7
x+5
.
*NotNull(V1) #
-1
11
4
x+7
x
10
x+5
.
*Monomial(V1) #
-1
11
4
x
10
;
x+7
x+5
.
*HasConstTerm(V1) #
-1
11
4
x+7
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

