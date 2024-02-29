(setq b '(break))

(setq i 0)

(while true
    (print i)
    (setq i (plus i 1))
    (cond (equal i 10) (eval b) null))
