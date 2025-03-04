'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';

import { Test } from '@/schemas/test';

import { ConfirmationDialog } from '@/components/common';
import { Button, buttonVariants } from '@/components/shadcnUi/button';
import { Skeleton } from '@/components/shadcnUi/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcnUi/tablet';

import { APP_ROUTES } from '@/constants';

interface ListTestProps {
  list: Test[];
  isLoading: boolean;
  isEmptyTestList: boolean;
  isEmptyServerTestList: boolean;
  isAdmin: boolean;
  itemsPerPage: number;
  sortBy: string;
  handleSortChange: () => void;
  deleteTest: (testId: number) => void;
  startTest: (testId: number) => void;
}

export const ListTest = ({
  list,
  isLoading,
  isEmptyTestList,
  isEmptyServerTestList,
  isAdmin,
  itemsPerPage,
  sortBy,
  handleSortChange,
  deleteTest,
  startTest,
}: ListTestProps) => {
  const [isStartTestModalOpen, setIsStartTestModalOpen] = useState(false);
  const [isDeleteTestModalOpen, setIsDeleteTestModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const handleStartTest = (test: Test) => {
    setSelectedTest(test);
    setIsStartTestModalOpen(true);
  };

  const handleDeleteTest = (test: Test) => {
    setSelectedTest(test);
    setIsDeleteTestModalOpen(true);
  };

  const confirmDeleteTest = () => {
    if (selectedTest) deleteTest(selectedTest.id);
    setIsDeleteTestModalOpen(false);
  };

  const confirmStartTest = () => {
    if (selectedTest) startTest(selectedTest.id);
    setIsStartTestModalOpen(false);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Название теста</TableHead>
            <TableHead className="w-[30%]">
              <button onClick={handleSortChange} className="flex items-center">
                Дата создания
                {sortBy === 'created_at_desc' ? (
                  <ChevronDown className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronUp className="ml-2 h-4 w-4" />
                )}
              </button>
            </TableHead>
            {isAdmin && <TableHead className="w-[20%]">Действия</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(itemsPerPage)].map((_, i) => (
              <TableRow className="h-14" key={i}>
                <TableCell colSpan={isAdmin ? 3 : 2}>
                  <Skeleton className="h-9 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : isEmptyTestList ? (
            <TableRow className="h-14">
              <TableCell colSpan={isAdmin ? 3 : 2}>
                {isEmptyServerTestList
                  ? 'Тесты в пути! Загляните чуть позже.'
                  : 'По вашему запросу ничего не найдено.'}
              </TableCell>
            </TableRow>
          ) : (
            list.map((test) => (
              <TableRow
                key={test.id}
                onClick={() => handleStartTest(test)}
                className="h-14 cursor-pointer"
              >
                <TableCell>{test.title}</TableCell>
                <TableCell>
                  {new Date(test.created_at).toLocaleDateString()}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <Link
                      href={APP_ROUTES.TESTS.EDIT(test.id)}
                      className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon',
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTest(test);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={isStartTestModalOpen}
        onOpenChange={setIsStartTestModalOpen}
        title="Начать прохождение теста?"
        message={`Вы собираетесь начать тест "${selectedTest?.title}". Убедитесь, что вы готовы.`}
        confirmText="Начать"
        onConfirm={confirmStartTest}
        confirmVariant="brand"
      />
      <ConfirmationDialog
        open={isDeleteTestModalOpen}
        onOpenChange={setIsDeleteTestModalOpen}
        title="Удалить тест?"
        message={`Вы собираетесь удалить тест "${selectedTest?.title}". Вы уверены?`}
        confirmText="Удалить"
        confirmVariant="destructive"
        onConfirm={confirmDeleteTest}
      />
    </>
  );
};
