(eval 1)
(eval 2.5)
(eval false)
(eval true)
(eval null)
(eval (cond true 1 0))

(setq b (quote (break)))
(while true
    (print (quote loop))
    (eval b))
