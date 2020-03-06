(deftemplate MAIN::button 
	(slot name) 
	(slot value))
(deftemplate MAIN::problem 
	(slot name) 
	(multislot interface-elements) 
	(multislot subgoals) 
	(slot done) 
	(slot description)) 
(deftemplate MAIN::table 
	(slot name) 
	(multislot columns))
(deftemplate MAIN::column 
	(slot name) 
	(multislot cells) 
	(slot position) 
	(slot description)) 
(deftemplate MAIN::cell 
	(slot name) 
	(slot value) 
	(slot description) 
	(slot row-number) 
	(slot column-number))

(provide wmeTypes)