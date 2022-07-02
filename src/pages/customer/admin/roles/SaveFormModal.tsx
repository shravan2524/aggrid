import React, { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'app/hooks';
import CustomButton from 'components/CustomButton';
import {
  isPostLoadingSelector,
  isPutLoadingSelector, update, create,

} from 'state/roles/slice';
import { hideModal } from 'app/utils/Modal';
import { RoleType } from 'services/roles';
import { pages } from './pages';

interface ModalProps {
  itemData: RoleType | null;
}

interface SaveFormTypes extends Record<string, any> {
  title: string;
}

export default function SaveFormModal({ itemData }: ModalProps) {
  const dispatch = useAppDispatch();
  const isPutLoading = useSelector(isPutLoadingSelector);
  const isPostLoading = useSelector(isPostLoadingSelector);
  const isLoading = isPostLoading || isPutLoading;

  const modalId = useMemo(() => 'saveRoleModal', []);

  const schema = yup.object({
    title: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SaveFormTypes>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    if (!formData) {
      return;
    }

    const data: Record<string, any> = {
      title: formData.title,
      policies: [],
    };

    data.policies = Object.keys(formData.policy).map((key) => {
      const val = formData.policy[key];
      const vals = Object.keys(val).filter((x) => val[x] === true).join('');
      return { p: key, a: vals };
    }).filter((x) => (x.a)).sort((a, b) => (a.p < b.p ? -1 : 1));

    if (itemData?.id) {
      dispatch(update({ title: data.title, policies: data.policies, id: itemData.id }));
    } else {
      dispatch(create({ title: data.title, policies: data.policies }));
    }
  };

  useEffect(() => {
    hideModal(modalId);
  }, [isLoading]);

  useEffect(() => {
    if (itemData) {
      setValue('title', itemData.title);
      itemData?.policies?.forEach((item) => {
        ['c', 'r', 'u', 'd'].forEach((it) => {
          setValue(`policy.${item?.p}.${it}`, item?.a?.includes(it) || false);
        });
      });
    }

    return function cleanup() {
      setValue('title', '');
      pages.forEach((e) => {
        ['c', 'r', 'u', 'd'].forEach((i) => {
          setValue(`policy.${e.uuid}.${i}`, false);
        });
      });
    };
  }, [itemData]);

  const modalTitle = itemData?.id ? 'Edit Role' : 'Create Role';

  return (
    <div className="modal fade" id={modalId} aria-labelledby={`new${modalId}Label`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id={`new${modalId}Label`}>{modalTitle}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="col-form-label required">Title (*)</label>
                <input
                  {...register('title')}
                  id="title"
                  className={classNames(['form-control form-control-sm', { 'is-invalid': errors.title }])}
                  placeholder=""
                />
                {errors.title && (
                  <div id="validationTitleFeedback" className="invalid-feedback">
                    <p>{errors.title?.message}</p>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="" className="col-form-label required">Policies (*)</label>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">&nbsp;</th>
                      <th scope="col">
                        <div className="form-check">
                          <label htmlFor="checkAllCreate" className="form-check-label mb-0">Create</label>
                          {/* <input type="checkbox" className="form-check-input" id="checkAllCreate" /> */}
                        </div>
                      </th>
                      <th scope="col">
                        <div className="form-check">
                          <label htmlFor="checkAllRead" className="form-check-label mb-0">Read</label>
                          {/* <input type="checkbox" className="form-check-input" id="checkAllRead" /> */}
                        </div>
                      </th>
                      <th scope="col">
                        <div className="form-check">
                          <label htmlFor="checkAllUpdate" className="form-check-label mb-0">Update</label>
                          {/* <input type="checkbox" className="form-check-input" id="checkAllUpdate" /> */}
                        </div>
                      </th>
                      <th scope="col">
                        <div className="form-check">
                          <label htmlFor="checkAllDelete" className="form-check-label mb-0">Delete</label>
                          {/* <input type="checkbox" className="form-check-input" id="checkAllDelete" /> */}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      pages.map((e, idx) => (
                        <tr key={idx}>
                          <th scope="row">{e.title}</th>
                          {
                            ['c', 'r', 'u', 'd'].map((k, idx2) => (
                              <td key={idx2}>
                                <div className="form-check">
                                  <label htmlFor={`checkbox_policy_${e.uuid}_${k}`} className="form-check-label mb-0">select</label>
                                  <input type="checkbox" {...register(`policy.${e.uuid}.${k}`)} className="form-check-input" id={`checkbox_policy_${e.uuid}_${k}`} />
                                </div>
                              </td>
                            ))
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-danger" data-bs-dismiss="modal">
                Close
              </button>
              <CustomButton
                isLoading={isLoading}
                isSubmit
                className="btn btn-sm btn-primary"
              >
                Save
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
