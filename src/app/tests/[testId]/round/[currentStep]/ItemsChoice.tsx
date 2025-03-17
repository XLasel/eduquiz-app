import { Control } from 'react-hook-form';

import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import {
  CurrentUserAnswerValue,
  NumberAnswerValue,
} from '@/schemas/sessionTest';
import { Question } from '@/schemas/test';

import { Checkbox } from '@/components/shadcnUi/checkbox';
import { FormControl, FormField, FormItem } from '@/components/shadcnUi/form';
import { Input } from '@/components/shadcnUi/input';
import { RadioGroup, RadioGroupItem } from '@/components/shadcnUi/radioGroup';

const baseInputStyle = 'rounded-lg border p-4 transition-all';

const itemsChoiceVariant = cva(
  [baseInputStyle, 'block cursor-pointer hover:bg-secondary'],
  {
    variants: {
      isChecked: {
        true: 'border-primary bg-secondary',
        false: '',
      },
    },
    defaultVariants: {
      isChecked: false,
    },
  }
);

const ItemsChoiceLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row items-center space-x-3 space-y-0">
    {children}
  </div>
);

const ItemsChoiceLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-base font-normal leading-normal">{children}</span>
);

const SingleChoice = ({
  control,
  currentQuestion,
}: {
  control: Control<Extract<CurrentUserAnswerValue, { type: 'single' }>>;
  currentQuestion: Question;
}) => (
  <FormField
    control={control}
    name="selectedAnswerId"
    render={({ field }) => (
      <RadioGroup
        onValueChange={(value) => {
          field.onChange(Number(value));
        }}
        defaultValue={field.value?.toString()}
      >
        {currentQuestion.answers?.map((option, i) => (
          <FormItem key={i}>
            <label
              className={itemsChoiceVariant({
                isChecked: field.value === option.id,
              })}
            >
              <ItemsChoiceLayout>
                <FormControl>
                  <RadioGroupItem
                    className="flex-shrink-0"
                    value={option.id.toString()}
                  />
                </FormControl>
                <ItemsChoiceLabel>{option.text}</ItemsChoiceLabel>
              </ItemsChoiceLayout>
            </label>
          </FormItem>
        ))}
      </RadioGroup>
    )}
  />
);

const MultipleChoice = ({
  control,
  currentQuestion,
}: {
  control: Control<Extract<CurrentUserAnswerValue, { type: 'multiple' }>>;
  currentQuestion: Question;
}) => (
  <FormField
    control={control}
    name="selectedAnswerId"
    render={({ field }) => (
      <div className="space-y-2">
        {currentQuestion.answers?.map((option, i) => {
          const isChecked = field.value?.includes(option.id);

          const toggleChecked = () => {
            const currentValue = field.value || [];
            if (isChecked) {
              field.onChange(currentValue.filter((id) => id !== option.id));
            } else {
              field.onChange([...currentValue, option.id]);
            }
          };

          return (
            <FormItem key={i}>
              <label
                className={itemsChoiceVariant({
                  isChecked,
                })}
              >
                <ItemsChoiceLayout>
                  <FormControl>
                    <Checkbox
                      className="flex-shrink-0"
                      checked={isChecked}
                      onCheckedChange={toggleChecked}
                    />
                  </FormControl>
                  <ItemsChoiceLabel>{option.text}</ItemsChoiceLabel>
                </ItemsChoiceLayout>
              </label>
            </FormItem>
          );
        })}
      </div>
    )}
  />
);

const NumberInput = ({ control }: { control: Control<NumberAnswerValue> }) => (
  <FormField
    control={control}
    name="numericAnswer"
    render={({ field }) => (
      <Input
        type="number"
        className={cn(
          baseInputStyle,
          'block h-max text-base focus:border-primary focus:ring-2 focus:ring-primary'
        )}
        placeholder="Введите числовой ответ"
        {...field}
        value={field.value ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === '') {
            field.onChange(null);
          } else if (!isNaN(Number(value))) {
            field.onChange(Number(value));
          }
        }}
      />
    )}
  />
);

export { MultipleChoice, NumberInput, SingleChoice };
