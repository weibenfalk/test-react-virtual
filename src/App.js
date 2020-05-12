import React, { useState, useEffect } from 'react';
import { useVirtual } from 'react-virtual';
// Components
import User from './User';
// Styles
import { Content, Loading } from './App.styles';
// API
import { getUsers } from './API';

function App() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const parentRef = React.useRef();
  const rowVirtualizer = useVirtual({
    size: users.length,
    parentRef,
    estimateSize: React.useCallback(() => 60, []),
    // overscan: 10,
  });
  console.log(users)
  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const newUsers = await getUsers(page);
      setUsers((prev) => [...prev, ...newUsers]);
      setLoading(false);
    };

    loadUsers();
  }, [page]);

  return (
    <div className='App'>
     
        <div
          ref={parentRef}
          onScroll={handleScroll}
          className='List'
          style={{
            height: `100%`,
            width: `100%`,
            overflow: 'auto',
          }}
        >
          <div
            className='ListInner'
            style={{
              height: `${rowVirtualizer.totalSize}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow) => (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <User
                  key={users[virtualRow.index].cell}
                  user={users[virtualRow.index]}
                />
              </div>
            ))}
          </div>
        </div>
     
      {loading && <Loading>Loading ...</Loading>}
    </div>
  );
}

export default App;
