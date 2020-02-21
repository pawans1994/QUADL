class TreeNode
  constructor: (@operator, @left, @right) ->
  evaluate: () -> @

class AssignNode extends TreeNode
  constructor: (@variableTable, @left, @right) ->

  evaluate: () -> @variableTable.put @left.variable, @right.evaluate()

class IfElseNode extends TreeNode
  constructor: (@condition, @left, @right) -> @operator = 'IF'

  evaluate: () -> if @condition.evaluate() then @left.evaluate() else @right.evaluate()

class LogicalNode extends TreeNode
  evaluate: () ->
    switch @operator
      when 'AND' then @left.evaluate() && @right.evaluate()
      when 'OR' then @left.evaluate() || @right.evaluate()
      when 'NOT' then !@left.evaluate()

class BitLogicalNode extends TreeNode
  evaluate: () ->
    switch @operator
      when 'BITAND' then @left.evaluate() & @right.evaluate()
      when 'BITOR' then @left.evaluate() | @right.evaluate()
      when 'BITXOR' then @left.evaluate() ^ @right.evaluate()
      when 'BITNOT' then ~@left.evaluate()

class RelationNode extends TreeNode
  evaluate: () ->
    switch @operator
      when 'LESS' then @left.evaluate() < @right.evaluate()
      when 'GREATER' then @left.evaluate() > @right.evaluate()
      when 'LESSEQUAL' then @left.evaluate() <= @right.evaluate()
      when 'GREATEREQUAL' then @left.evaluate() >= @right.evaluate()
      when 'EQUAL' then @left.evaluate() == @right.evaluate()
      when 'NOTEQUAL' then @left.evaluate() != @right.evaluate()

class AdditionNode extends TreeNode
  evaluate: () ->
    switch @operator
      when 'PLUS' then @left.evaluate() + @right.evaluate()
      when 'MINUS' then @left.evaluate() - @right.evaluate()

class MultiplicationNode extends TreeNode
  evaluate: () ->
    switch @operator
      when 'TIMES' then @left.evaluate() * @right.evaluate()
      when 'DIVIDE' then @left.evaluate() / @right.evaluate()
      when 'REM' then @left.evaluate() % @right.evaluate()

class ListNode extends TreeNode
  constructor: (@operator, list, expression) ->
    @expressions = if list? then [list] else []
    @expressions.push expression if expression?

  evaluate: () -> @expressions.reduce ((result, expression) -> expression.evaluate()), null

class FunctionNode extends TreeNode
  constructor: (@functionTable, @function, @arguments) ->

  evaluate: () ->
    if (func = @functionTable[@function])? then func.call null, @arguments.expressions.map((node) -> node.evaluate()) else null

class VariableNode extends TreeNode
  constructor: (@variableTable, @sai, @variable) ->

  evaluate: () -> @variableTable.get(@variable) || @sai[@variable] || null

class ConstantNode extends TreeNode
  constructor: (@value) ->

  evaluate: () -> @value

CTATFormulaTree =
  TreeNode: TreeNode, AssignNode: AssignNode, IfElseNode: IfElseNode, LogicalNode: LogicalNode, BitLogicalNode: BitLogicalNode,
  RelationNode: RelationNode, AdditionNode: AdditionNode, MultiplicationNode: MultiplicationNode, ListNode: ListNode,
  FunctionNode: FunctionNode, VariableNode: VariableNode, ConstantNode: ConstantNode

if module? then module.exports = CTATFormulaTree else @CTATFormulaTree = CTATFormulaTree
