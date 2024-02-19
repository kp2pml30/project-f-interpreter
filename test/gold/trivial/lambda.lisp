(setq f (lambda ()))
(print (f))

(setq f (lambda (x y) (plus x y)))
(f 10 12)

((lambda ()
    (prog ()
     (return 10)
     11)))
