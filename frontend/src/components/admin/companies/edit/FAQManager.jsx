import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash } from 'react-icons/fa';

const FAQManager = ({ faqs, onFaqChange }) => {
  const { t } = useTranslation();

  const handleAddFaq = () => {
    onFaqChange([...(faqs || []), { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    onFaqChange(newFaqs);
  };

  const handleFaqInputChange = (index, field, value) => {
    const newFaqs = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    onFaqChange(newFaqs);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddFaq}
          className="btn btn-primary btn-sm gap-2"
        >
          <FaPlus />
          {t('company.faqs.add')}
        </button>
      </div>

      <div className="space-y-4">
        {(faqs || []).map((faq, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-base-200 relative"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  {t('company.faqs.question')} #{index + 1}
                </span>
              </label>
              <input
                type="text"
                value={faq.question}
                onChange={(e) =>
                  handleFaqInputChange(index, 'question', e.target.value)
                }
                className="input input-bordered w-full"
                placeholder={t('company.faqs.questionPlaceholder')}
              />
            </div>

            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text font-semibold">
                  {t('company.faqs.answer')} #{index + 1}
                </span>
              </label>
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  handleFaqInputChange(index, 'answer', e.target.value)
                }
                className="textarea textarea-bordered w-full"
                rows="3"
                placeholder={t('company.faqs.answerPlaceholder')}
              ></textarea>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveFaq(index)}
              className="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
              aria-label={t('company.faqs.remove')}
            >
              <FaTrash className="text-error" />
            </button>
          </div>
        ))}
      </div>

      {(!faqs || faqs.length === 0) && (
        <div className="text-center py-8 text-base-content/60">
          <p>{t('company.faqs.noFaqs')}</p>
        </div>
      )}
    </div>
  );
};

// ✅ PropTypes for better validation
FAQManager.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
  onFaqChange: PropTypes.func.isRequired,
};

export default FAQManager;
