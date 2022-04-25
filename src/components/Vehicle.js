import React, { useState, useEffect } from "react";
import styles from "./Vehicle.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAsyncGetVehicles,
  fetchAsyncCreateVehicle,
  fetchAsyncUpdateVehicle,
  fetchAsyncDeleteVehicle,
  editVehicle,
  selectSegments,
  selectBrands,
  selectVehicles,
  selectEditedVehicle,
} from "../features/vehicleSlice";

const Vehicle = () => {
  const dispatch = useDispatch();
  const segments = useSelector(selectSegments);
  const brands = useSelector(selectBrands);
  const vehicles = useSelector(selectVehicles);
  const editedVehicle = useSelector(selectEditedVehicle);
  const [successMsg, setSuccessMsg] = useState("");

  const segmentOptions = segments?.map((seg) => (
    <option key={seg.id} value={seg.id}>
      {seg.segment_name}
    </option>
  ));
  const brandOptions = brands?.map((brand) => (
    <option key={brand.id} value={brand.id}>
      {brand.brand_name}
    </option>
  ));

  useEffect(() => {
    const fetchBootLoader = async () => {
      const result = await dispatch(fetchAsyncGetVehicles());
      if (fetchAsyncGetVehicles.rejected.match(result)) {
        setSuccessMsg("Get error!");
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      <h3 data-testid="h3-vehicle">Vehicle</h3>
      <span className={styles.vehicle__status}>{successMsg}</span>
      <div className={styles.vehicle__input}>
        <input
          type="text"
          placeholder="new vehicle name"
          value={editedVehicle.vehicle_name}
          onChange={(e) =>
            dispatch(
              editVehicle({ ...editedVehicle, vehicle_name: e.target.value })
            )
          }
        />
        <input
          type="number"
          placeholder="year of release"
          min="0"
          value={editedVehicle.release_year}
          onChange={(e) =>
            dispatch(
              editVehicle({
                ...editedVehicle,
                release_year: e.target.value,
              })
            )
          }
        />
        <input
          type="number"
          placeholder="price"
          min="0"
          step="0.01"
          value={editedVehicle.price}
          onChange={(e) =>
            dispatch(
              editVehicle({
                ...editedVehicle,
                price: e.target.value,
              })
            )
          }
        />
      </div>
      <select
        data-testid="select-segment"
        value={editedVehicle.segment}
        onChange={(e) =>
          dispatch(editVehicle({ ...editedVehicle, segment: e.target.value }))
        }
      >
        <option value={0}>Segment</option>
        {segmentOptions}
      </select>

      <select
        data-testid="select-brand"
        value={editedVehicle.brand}
        onChange={(e) =>
          dispatch(editVehicle({ ...editedVehicle, brand: e.target.value }))
        }
      >
        <option value={0}>Brand</option>
        {brandOptions}
      </select>
      <button
        data-testid="btn-vehicle-post"
        disabled={
          !editedVehicle.vehicle_name |
          !editedVehicle.segment |
          !editedVehicle.brand
        }
        onClick={
          editedVehicle.id === 0
            ? async () => {
                await dispatch(fetchAsyncCreateVehicle(editedVehicle));
                await dispatch(
                  editVehicle({
                    id: 0,
                    vehicle_name: "",
                    release_year: 2020,
                    price: 0.0,
                    segment: 0,
                    brand: 0,
                  })
                );
              }
            : async () => {
                const result = await dispatch(
                  fetchAsyncUpdateVehicle(editedVehicle)
                );
                await dispatch(
                  editVehicle({
                    id: 0,
                    vehicle_name: "",
                    release_year: 2020,
                    price: 0.0,
                    segment: 0,
                    brand: 0,
                  })
                );
                if (fetchAsyncUpdateVehicle.fulfilled.match(result)) {
                  setSuccessMsg("Updated in vehicle!");
                }
              }
        }
      >
        {editedVehicle.id === 0 ? "Create" : "Update"}
      </button>
      <ul>
        {vehicles.map((vehicle) => (
          <li className={styles.vehicle__item} key={vehicle.id}>
            <span data-testid={`list-${vehicle.id}`}>
              <strong data-testid={`name-${vehicle.id}`}>
                {vehicle.vehicle_name}
              </strong>
              --{vehicle.release_year}--- ¥{vehicle.price}
              [M] ---
              {vehicle.segment_name} {vehicle.brand_name}---
            </span>
            <div>
              <button
                data-testid={`delete-veh-${vehicle.id}`}
                onClick={async () => {
                  const result = await dispatch(
                    fetchAsyncDeleteVehicle(vehicle.id)
                  );
                  if (fetchAsyncDeleteVehicle.fulfilled.match(result)) {
                    setSuccessMsg("Deleted in vehicle!");
                  }
                }}
              >
                delete
              </button>
              <button
                data-testid={`edit-veh-${vehicle.id}`}
                onClick={async () => {
                  await dispatch(editVehicle(vehicle));
                }}
              >
                edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Vehicle;
