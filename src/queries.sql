CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(30),
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into produtos(nome,preco,quantidade)
            values('celular',5000.25,50);
            
insert into produtos(nome,preco,quantidade)
            values('TV',6500.10,5);
                        
select * from produtos order by nome;            

update produtos set nome='celular', 
                    preco=5000.25, 
                    quantidade=45
                    where id=1;

select * from produtos order by nome;

delete from produtos where id=2;

select * from produtos order by nome;



