import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import CategoryContext from "../../CategoryContext";
import RecordContext from "../../RecordContext";
import View from "../../components/View";
import moment from "moment";
import AppHelper from "../../app-helper";
import Swal from "sweetalert2";

export default function Expense() {
  const { records } = useContext(RecordContext);
  const { categories } = useContext(CategoryContext);
  // console.log(records);
  // console.log(categories);

  const [categoryIds, setCategoryIds] = useState([]);
  //   console.log(categoryIds);
  const [expensesDescription, setExpensesDescription] = useState([]);
  //   console.log(expensesDescription);
  const [expensesAmount, setExpensesAmount] = useState([]);
  //   console.log(expensesAmount);
  const [bgColors, setBgColors] = useState([]);

  const [filteredRecord, setFilteredRecord] = useState([]);
  const [startDate, setStartDate] = useState([]);
  // console.log(startDate);
  const [endDate, setEndDate] = useState([]);
  // console.log(endDate);

  useEffect(() => {
    const expenseCategory = categories.filter(
      (category) => category.categoryType === "expense"
    );
    // console.log(expenseCategory);
    const expenseCategoryIds = expenseCategory.map((category) => category._id);
    // console.log(expenseCategoryIds);

    setCategoryIds(expenseCategoryIds);
  }, [categories]);

  useEffect(() => {
    const recordsA = records.filter((record) =>
      categoryIds.includes(record.categoryId)
    );
    // console.log(recordsA);

    const recordB = recordsA.filter((record) => {
      if (
        moment(record.createdOn).format("YYYY-MM-DD") >= startDate &&
        moment(record.createdOn).format("YYYY-MM-DD") <= endDate
      ) {
        return record;
      }
    });
    setFilteredRecord(recordB);
    // console.log(recordB);
  }, [records, categories, startDate, endDate]);

  useEffect(() => {
    const recordC = filteredRecord.map((record) => record.description);
    // console.log(recordC);
    setExpensesDescription(recordC);

    const recordD = filteredRecord.map((record) => record.amount);
    // console.log(recordD);
    setExpensesAmount(recordD);

    setBgColors(filteredRecord.map(() => `#${AppHelper.colorRandomizer()}`));
  }, [filteredRecord, startDate, endDate]);

  const data = {
    labels: expensesDescription,
    datasets: [
      {
        data: expensesAmount,
        backgroundColor: bgColors,
        hoverBackgroundColor: bgColors,
      },
    ],
  };

  return (
    <View title={"Category Breakdown: Expense"}>
      <Row className="justify-content-center">
        <Col md="10">
          <Container className="mb-5 container">
            <h3>Expenses</h3>
            <br />
            <p className="text-muted">SELECT DATE</p>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>From:</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>To:</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Pie data={data} />
          </Container>
        </Col>
      </Row>
    </View>
  );
}
