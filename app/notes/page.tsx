import { useState } from 'react';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import { fetchNotes } from '../../services/noteService';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [debouncedQuery] = useDebounce(query, 500);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ['notes', page, debouncedQuery],
    queryFn: () => fetchNotes(debouncedQuery, page, 12),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={handleSearch} />
        {totalPages > 1 && (<Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage}/>)}
        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>
      {notes.length > 0 && (<NoteList notes={notes} />)}
      {isModalOpen && (<Modal onClose={closeModal}>
        <NoteForm onClose={closeModal}></NoteForm>
      </Modal>)}
    </div>
  );
}

export default App;
