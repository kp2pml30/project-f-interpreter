(func filter (f l)
    (cond (isnull l)
        l
        (prog (rest)
            (setq rest (filter f (tail l)))
            (cond (f (head l))
                (cons (head l) rest)
                rest))))

(func len (l)
    (cond (isnull l)
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
