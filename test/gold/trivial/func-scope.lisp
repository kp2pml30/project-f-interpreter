(func foo (a)
    (lambda ()
        (setq a (plus a 1))
        a))

(setq f1 (foo 10))
(setq f2 (foo 20))
(f1)
(f1)
(f2)
(f1)