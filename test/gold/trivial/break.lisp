(setq a 1)

(while true (setq a (plus a 1)) (break))
(print a)
(while (break) (setq a (plus a 1)))
(print a)
