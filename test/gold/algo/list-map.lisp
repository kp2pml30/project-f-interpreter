(func map (f l)
    (cond (isnull l)
        l
        (cons (f (head l)) (map f (tail l)))))

(map (lambda (a) (plus 1 a)) (quote (1 2 3 4)))
