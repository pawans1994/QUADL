V1: x, 4, x+7, -1, 11.
V4: subtract 7.

done(V1, V1) ##
x, 4
.
*HasVarTerm(V1) #
x+7
;
-1
11
4
x
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
.
*IsFractionTerm(V1) #
;
-1
11
4
x+7
x
.
*IsAVarTerm(V1) #
x
;
-1
11
4
x+7
.
*IsSkillAdd(V4) #
;
subtract 7
.
*IsLastConstTermNegative(V1) #
;
-1
11
4
x+7
x
.
*HasCoefficient(V1) #
;
-1
11
4
x+7
x
.
*IsConstant(V1) #
-1
11
4
;
x+7
x
.
*IsPolynomial(V1) #
x+7
;
-1
11
4
x
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
.
*HasParentheses(V1) #
;
-1
11
4
x+7
x
.
*IsSkillSubtract(V4) #
subtract 7
.
*IsSkillMultiply(V4) #
;
subtract 7
.
*Homogeneous(V1) #
-1
11
4
x
;
x+7
.
*NotNull(V1) #
-1
11
4
x+7
x
.
*Monomial(V1) #
-1
11
4
x
;
x+7
.
*HasConstTerm(V1) #
-1
11
4
x+7
;
x
.
*IsSkillDivide(V4) #
;
subtract 7
.

