'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Plus, RefreshCw } from 'lucide-react';

import {
  startTestDeletion,
  startTestListFetch,
} from '@/redux/actions/testActions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAdmin } from '@/redux/selectors/authSelectors';
import {
  selectIsEmptyTestList,
  selectIsTestStateLoading,
  selectTests,
  selectTestStateError,
} from '@/redux/selectors/testSelectors';
import { markTestsListStale } from '@/redux/slices/testSlice';
import { cn, compareCacheKeys, generateCacheKey } from '@/lib/utils';

import { ItemsPerPageButton, Pagination, Search } from '@/components/common';
import { RequireAuth } from '@/components/logic';
import { Button, buttonVariants } from '@/components/shadcnUi/button';

import { APP_ROUTES, DEFAULT_PARAMS, MAX_RETRY_COUNT } from '@/constants';
import {
  useDebouncedCallback,
  useParsedSearchParams,
  useQueryParams,
} from '@/hooks';

import { ListTest } from './ListTest';
import Loading from './loading';

const TestsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { updateQueryParams } = useQueryParams();
  const searchParams = useParsedSearchParams();
  const isAdmin = useAppSelector(selectIsAdmin);
  const { key, pagination, isStale, list } = useAppSelector(selectTests);
  const isLoading = useAppSelector(selectIsTestStateLoading);
  const isEmptyTestList = useAppSelector(selectIsEmptyTestList);
  const error = useAppSelector(selectTestStateError);
  const [retryCount, setRetryCount] = useState(0);

  const {
    search = DEFAULT_PARAMS.search,
    sort = DEFAULT_PARAMS.sort,
    per = DEFAULT_PARAMS.per,
    page = DEFAULT_PARAMS.page,
  } = searchParams;

  const [searchTerm, setSearchTerm] = useState(search);

  const isEmptyServerTestList =
    isEmptyTestList &&
    search === DEFAULT_PARAMS.search &&
    sort === DEFAULT_PARAMS.sort;

  const currentPage = useMemo(() => {
    if (page && pagination.total_pages && page > pagination.total_pages) {
      updateQueryParams({
        paramsToAdd: { page: pagination.total_pages.toString() },
      });
      return pagination.total_pages;
    }
    return page;
  }, [page, pagination.total_pages, updateQueryParams]);

  const debouncedSearch = useDebouncedCallback(
    (query: string) => updateQueryParams({ paramsToAdd: { search: query } }),
    500
  );

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    debouncedSearch(newValue);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    updateQueryParams({ paramsToRemove: ['search'] });
  };

  const handleSortChange = () => {
    const newSortBy =
      sort === 'created_at_desc' ? 'created_at_asc' : 'created_at_desc';
    updateQueryParams({ paramsToAdd: { sort: newSortBy } });
  };

  const handlePaginationChange = (newPage: number) => {
    updateQueryParams({ paramsToAdd: { page: newPage.toString() } });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    updateQueryParams({ paramsToAdd: { per: newItemsPerPage.toString() } });
  };

  const handleRefresh = () => {
    setRetryCount(0);
    dispatch(markTestsListStale());
  };

  const deleteTest = (id: number) => dispatch(startTestDeletion(id));

  const startTest = (id: number) => router.push(APP_ROUTES.TESTS.ROUND(id, 1));

  const updateTestList = useCallback(() => {
    if (key && compareCacheKeys(key, generateCacheKey(searchParams))) return;
    dispatch(startTestListFetch(searchParams));
  }, [searchParams, dispatch, key]);

  useEffect(() => {
    if (error && retryCount < MAX_RETRY_COUNT) {
      const timer = setTimeout(
        () => {
          setRetryCount((prev) => prev + 1);
          dispatch(startTestListFetch(searchParams));
        },
        1000 * Math.pow(2, retryCount)
      );

      return () => clearTimeout(timer);
    }
  }, [error, retryCount, dispatch, searchParams]);

  useEffect(() => {
    updateTestList();
  }, [updateTestList]);

  useEffect(() => {
    if (isStale !== false) {
      dispatch(startTestListFetch(searchParams));
    }
  }, [isStale, searchParams, dispatch]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          'grid justify-items-stretch gap-4 min-[450px]:grid-cols-[1fr_auto] min-[450px]:grid-rows-2',
          isAdmin
            ? 'grid-cols-1 grid-rows-3'
            : 'grid-cols-[1fr_auto] grid-rows-2'
        )}
      >
        <h1 className="truncate text-2xl font-bold min-[450px]:col-span-1 md:col-span-full">
          Список тестов
        </h1>
        <Search
          className="col-span-full w-full self-start min-[450px]:row-start-2 md:col-span-1 md:justify-self-start"
          placeholder="Поиск тестов..."
          value={searchTerm}
          onChange={handleChangeSearch}
          onClear={handleClearSearch}
        />
        <div
          className={cn(
            'flex justify-stretch gap-3 min-[450px]:col-start-2 min-[450px]:row-start-1 md:row-start-2',
            isAdmin ? 'row-start-2' : 'col-start-2 row-start-1'
          )}
        >
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            <span className="sr-only">Обновить</span>
          </Button>
          {isAdmin && (
            <Link
              href={APP_ROUTES.TESTS.CREATE}
              className={cn(buttonVariants(), 'flex-1')}
            >
              <Plus className="mr-2 h-4 w-4" /> Создать тест
            </Link>
          )}
        </div>
      </div>
      {error ? (
        <div className="flex flex-col gap-3">
          <p>
            {error.message ||
              'Не удалось загрузить список тестов. Пожалуйста, попробуйте позже.'}
          </p>
          <Button onClick={handleRefresh} className="w-fit">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Попробовать снова
          </Button>
        </div>
      ) : (
        <>
          <ListTest
            list={list}
            isLoading={isLoading}
            isEmptyTestList={isEmptyTestList}
            isEmptyServerTestList={isEmptyServerTestList}
            isAdmin={isAdmin}
            itemsPerPage={per}
            sortBy={sort}
            handleSortChange={handleSortChange}
            deleteTest={deleteTest}
            startTest={startTest}
          />
          <div className="flex justify-between">
            <ItemsPerPageButton
              selected={per}
              onChange={handleItemsPerPageChange}
            />
            {pagination.total_pages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                onPageChange={handlePaginationChange}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RequireAuth(TestsPage, {
  LoadingComponent: Loading,
});
