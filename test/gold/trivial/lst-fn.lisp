(func map (f l)
    (cond (isempty l)
        l
        (cons (f (head l)) (map f (tail l)))))

(map (lambda (a) (plus 1 a)) (quote (1 2 3 4)))

(func filter (f l)
    (cond (isempty l)
        l
        (prog (rest)
            (setq rest (filter f (tail l)))
            (cond (f (head l))
                (cons (head l) rest)
                rest))))


(filter (lambda (a) (greater a 1)) (quote (1 2 3 4 1 2 1)))

(func len (l)
    (cond (isempty l)
        0
        (plus 1 (len (tail l)))))

(func qsort (l)
    (cond (lesseq (len l) 1)
        l
        (prog (fst)
            (setq fst (head l))
            (concat
                (qsort (filter (lambda (a) (greater fst a)) l))
                (cons fst (quote ()))
                (qsort (filter (lambda (a) (less fst a)) l))
            )
        )
    )
)

(qsort (quote (5 4 9 2 1 12)))
