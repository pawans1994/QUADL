(deftemplate MAIN::button 
	(slot name) 
	(slot value))
(deftemplate MAIN::problem 
	(slot name) 
	(multislot interface-elements) 
	(multislot subgoals) 
	(slot done) 
	(slot description)) 
(deftemplate MAIN::textField 
	(slot name) 
	(slot value))

(provide wmeTypes)