import React, { FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

// CUSTOM IMPORTS
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import { Container, Title, Form, Error, Repositories } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [inputError, setInputError] = React.useState('');
  const [newRepo, setNewRepo] = React.useState('');
  const [repositories, setRepositories] = React.useState<Repository[]>([]);

  // FUNCTIONS
  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if(!newRepo){
      setInputError('Digite o autor/nome fo repositório.');
      return;
    }

    try{
      await api.get<Repository>(`repos/${newRepo}`).then(response => {
        const repository = response.data;

        setRepositories([...repositories, repository]);
        setNewRepo('');
        setInputError('');
      });
    } catch (err){
      setInputError('Erro na busca por esse repositório.');
    }
  }

  return (
    <Container>
      <img src={logo} alt="logo" />

      <Title>Dashboard</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

  {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <a href="teste" key={repository.full_name}>
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
          />

          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>

          <FiChevronRight size={20} />
        </a>
        ))}


      </Repositories>
    </Container>
  );
};

export default Dashboard;
