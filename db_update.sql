-- 1. Add the 'letter_type' column if it doesn't exist
ALTER TABLE public.letters 
ADD COLUMN IF NOT EXISTS letter_type text DEFAULT 'vowel';

-- 2. Add constraint to ensure only valid values
ALTER TABLE public.letters 
DROP CONSTRAINT IF EXISTS letter_type_check;

ALTER TABLE public.letters 
ADD CONSTRAINT letter_type_check CHECK (letter_type IN ('vowel', 'consonant'));

-- 3. Update VOWELS (Assuming Order 1-12 are vowels based on Brahmi structure)
UPDATE public.letters
SET letter_type = 'vowel'
WHERE order_no < 13;

-- 4. Update CONSONANTS (Assuming K-varg starts at 13)
UPDATE public.letters
SET letter_type = 'consonant'
WHERE order_no >= 13;

-- 5. Verify (Optional Select)
-- SELECT * FROM public.letters ORDER BY order_no;
