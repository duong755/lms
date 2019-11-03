- `Grid`

Chia lưới, một dòng có 12 cột

```javascript
<Grid container>
  <Grid item xl={} lg={} md={} sm={} xs={}>
    <Box>this is some text</Box>
  </Grid>
  <Grid item xl={} lg={} md={} sm={} xs={}>
    <Box>this is some text</Box>
  </Grid>
</Grid>
```

- `Box`

Thay thế cho bất cứ thẻ nào trong `html`

```javascript
<Box component="element-name">...</Box>
```

- `Typography`

Chỉ dùng để hiển thị t

```javascript
<Typography></Typography>
```

- `Paper`

Một element dùng để chứa, có background và border nổi hơn so với xung quanh

```javascript
<Paper></Paper>
```

- `Button`

```javascript
<Button variant="" color="" size="">CLICK ME</Button>
```

- `Link`

Cần phân biệt `Link` của material ui với `Link` của nextjs. Đặt `Link` của nextjs bao ngoài `Link` của material ui.

