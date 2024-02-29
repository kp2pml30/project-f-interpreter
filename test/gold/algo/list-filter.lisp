(func filter (f l)
    (cond (isnull l)
        l
        (prog (rest)
            (setq rest (filter f (tail l)))
            (cond (f (head l))
                (cons (head l) rest)
                rest))))


(filter (lambda (a) (greater a 1)) (quote (1 2 3 4 1 2 1)))
