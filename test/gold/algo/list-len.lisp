(func len (l)
    (cond (isnull l)
        0
        (plus 1 (len (tail l)))))

(len '())
(len '(1))
(len '(123))
