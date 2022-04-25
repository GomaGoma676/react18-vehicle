import React, { useState, useEffect } from "react";
import styles from "./Brand.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncGetBrands,
  fetchAsyncCreateBrand,
  fetchAsyncUpdateBrand,
  fetchAsyncDeleteBrand,
  editBrand,
  selectBrands,
  selectEditedBrand,
} from "../features/vehicleSlice";

const Brand = () => {
  const dispatch = useDispatch();
  const brands = useSelector(selectBrands);
  const editedBrand = useSelector(selectEditedBrand);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchBootLoader = async () => {
      const result = await dispatch(fetchAsyncGetBrands());
      if (fetchAsyncGetBrands.rejected.match(result)) {
        setSuccessMsg("Get error!");
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      <h3 data-testid="h3-brand">Brand</h3>
      <span className={styles.brand__status}>{successMsg}</span>
      <div>
        <input
          type="text"
          placeholder="new brand name"
          value={editedBrand.brand_name}
          onChange={async (e) =>
            await dispatch(
              editBrand({ ...editedBrand, brand_name: e.target.value })
            )
          }
        />
        <button
          data-testid="btn-post"
          disabled={!editedBrand.brand_name}
          onClick={
            editedBrand.id === 0
              ? async () => {
                  await dispatch(
                    fetchAsyncCreateBrand({
                      brand_name: editedBrand.brand_name,
                    })
                  );
                  await dispatch(
                    editBrand({
                      id: 0,
                      brand_name: "",
                    })
                  );
                }
              : async () => {
                  const result = await dispatch(
                    fetchAsyncUpdateBrand(editedBrand)
                  );
                  await dispatch(
                    editBrand({
                      id: 0,
                      brand_name: "",
                    })
                  );
                  if (fetchAsyncUpdateBrand.fulfilled.match(result)) {
                    setSuccessMsg("Updated in brand!");
                  }
                }
          }
        >
          {editedBrand.id === 0 ? "Create" : "Update"}
        </button>
        <ul>
          {brands.map((brand) => (
            <li className={styles.brand__item} key={brand.id}>
              <span data-testid={`list-${brand.id}`}>{brand.brand_name}</span>
              <div>
                <button
                  data-testid={`delete-brand-${brand.id}`}
                  onClick={async () => {
                    const result = await dispatch(
                      fetchAsyncDeleteBrand(brand.id)
                    );
                    if (fetchAsyncDeleteBrand.fulfilled.match(result)) {
                      setSuccessMsg("Deleted in brand!");
                    }
                  }}
                >
                  delete
                </button>
                <button
                  data-testid={`edit-brand-${brand.id}`}
                  onClick={async () => {
                    await dispatch(editBrand(brand));
                  }}
                >
                  edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Brand;
